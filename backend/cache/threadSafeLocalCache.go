package cache

import (
	"sync"
)

type LocalCacheType[KeyType comparable, ValueType any] struct {
	mu      sync.RWMutex
	items   map[KeyType]*ValueType
	order   []KeyType
	maxSize int
	Active  *bool
	evictFn func(k KeyType, items *(map[KeyType]*ValueType), order *[]KeyType)
}

func New[KeyType comparable, ValueType any](_maxSize int) *LocalCacheType[KeyType, ValueType] {
	maxSize := min(_maxSize, 1000) // limit the hard limit to 1000 items
	active := false
	return &LocalCacheType[KeyType, ValueType]{
		items:   make(map[KeyType]*ValueType),
		order:   make([]KeyType, 0, maxSize),
		maxSize: maxSize,
		Active:  &active,
	}
}

func (c *LocalCacheType[KeyType, ValueType]) Activate(checkActiveOnInit func() bool) {
	*c.Active = checkActiveOnInit()
}

func (c *LocalCacheType[KeyType, ValueType]) WithCustomEvictionStrategy(
	evictFn func(oldestKey KeyType, items *(map[KeyType]*ValueType), order *[]KeyType),
) {
	c.evictFn = evictFn
}

func (c *LocalCacheType[KeyType, ValueType]) Get(key KeyType) (ValueType, bool) {
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

func (c *LocalCacheType[KeyType, ValueType]) Add(key KeyType, value ValueType) {
	if !*c.Active {
		return
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	if _, found := c.items[key]; found {
		c.items[key] = &value
		c.RefreshOrder(key)
		return
	}

	if len(c.items) >= c.maxSize {
		oldestKey := c.order[0]
		if c.evictFn != nil {
			c.evictFn(oldestKey, &c.items, &c.order)
		} else {
			delete(c.items, oldestKey)
		}
		c.order = c.order[1:]
	}

	c.items[key] = &value
	c.order = append(c.order, key)
}

func (c *LocalCacheType[KeyType, ValueType]) RefreshOrder(key KeyType) {
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
