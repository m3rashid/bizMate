package utils

import (
	"sync"
)

type LocalCache[KeyType comparable, ValueType any] struct {
	mu      sync.RWMutex
	items   map[KeyType]*ValueType
	order   []KeyType
	maxSize int
	Active  *bool
	evictFn func(k KeyType, v ValueType, items *(map[KeyType]*ValueType), order *[]KeyType)
}

func newCache[KeyType comparable, ValueType any](_maxSize int) *LocalCache[KeyType, ValueType] {
	maxSize := min(_maxSize, 1000) // limit the hard limit to 1000 items
	active := false
	return &LocalCache[KeyType, ValueType]{
		items:   make(map[KeyType]*ValueType),
		order:   make([]KeyType, 0, maxSize),
		maxSize: maxSize,
		Active:  &active,
	}
}

func (c *LocalCache[KeyType, ValueType]) activate(checkActiveOnInit func() bool) {
	*c.Active = checkActiveOnInit()
}

func (c *LocalCache[KeyType, ValueType]) withCustomEvictionStrategy(
	evictFn func(oldestKey KeyType, oldestItemValue ValueType, items *(map[KeyType]*ValueType), order *[]KeyType),
) {
	c.evictFn = evictFn
}

func (c *LocalCache[KeyType, ValueType]) Get(key KeyType) (ValueType, bool) {
	var zero ValueType

	if !*c.Active {
		return zero, false
	}

	c.mu.RLock()
	defer c.mu.RUnlock()

	if item, found := c.items[key]; found {
		return *item, true
	}

	return zero, false
}

func (c *LocalCache[KeyType, ValueType]) Set(key KeyType, value ValueType) {
	if !*c.Active {
		return
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	if _, found := c.items[key]; found {
		c.items[key] = &value
		c.refreshOrder(key)
		return
	}

	if len(c.items) >= c.maxSize {
		oldestKey := c.order[0]
		oldestItem := c.items[oldestKey]

		if c.evictFn != nil {
			c.evictFn(oldestKey, *oldestItem, &c.items, &c.order)
		} else {
			delete(c.items, oldestKey)
		}
		c.order = c.order[1:]
	}

	c.items[key] = &value
	c.order = append(c.order, key)
}

func (c *LocalCache[KeyType, ValueType]) refreshOrder(key KeyType) {
	var index int
	for i, k := range c.order {
		if k == key {
			index = i
			break
		}
	}

	c.order = append(c.order[:index], c.order[index+1:]...)
	c.order = append(c.order, key)
}
