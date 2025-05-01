package async

import (
	"time"
)

type LocalCacheItem[Value any] struct {
	value      Value
	expiration time.Time
}

type LocalCache[Key comparable, Value any] struct {
	Name    string
	maxSize int
	ttl     time.Duration
	evictFn func(k Key, v Value)
	items   map[Key]*LocalCacheItem[Value]
	ops     chan func(map[Key]*LocalCacheItem[Value])
}

func NewLocalCache[Key comparable, Value any](
	name string,
	maxSize int,
	ttl time.Duration,
	evictFn func(k Key, v Value),
) *LocalCache[Key, Value] {
	cache := &LocalCache[Key, Value]{
		Name:    name,
		maxSize: maxSize,
		ttl:     ttl,
		evictFn: evictFn,
		items:   make(map[Key]*LocalCacheItem[Value]),
		ops:     make(chan func(map[Key]*LocalCacheItem[Value]), maxSize),
	}

	go cache.run()
	go cache.startCleanupTicker()

	return cache
}

func (c *LocalCache[Key, Value]) run() {
	for op := range c.ops {
		op(c.items)
	}
}

func (c *LocalCache[Key, Value]) startCleanupTicker() {
	ticker := time.NewTicker(c.ttl / 2)
	for range ticker.C {
		c.ops <- func(items map[Key]*LocalCacheItem[Value]) {
			now := time.Now()
			for key, item := range items {
				if now.After(item.expiration) {
					if c.evictFn != nil {
						c.evictFn(key, item.value)
					}
					delete(items, key)
				}
			}
		}
	}
}

type getResult[Value any] struct {
	value Value
	found bool
}

func (c *LocalCache[Key, Value]) Get(key Key) (Value, bool) {
	result := make(chan getResult[Value])

	c.ops <- func(items map[Key]*LocalCacheItem[Value]) {
		item, found := items[key]
		if found && time.Now().Before(item.expiration) {
			result <- getResult[Value]{item.value, true}
		} else {
			if found {
				delete(items, key)
			}

			result <- getResult[Value]{found: false}
		}
	}
	res := <-result
	return res.value, res.found
}

func (c *LocalCache[Key, Value]) Set(key Key, value Value) {
	c.ops <- func(items map[Key]*LocalCacheItem[Value]) {
		expiration := time.Now().Add(c.ttl)

		if item, found := items[key]; found {
			item.value = value
			item.expiration = expiration
			return
		}

		if len(items) >= c.maxSize {
			now := time.Now()
			for k, item := range items {
				if now.After(item.expiration) {
					if c.evictFn != nil {
						c.evictFn(k, item.value)
					}
					delete(items, k)
					if len(items) < c.maxSize {
						break
					}
				}
			}
		}

		if len(items) >= c.maxSize {
			for k, item := range items {
				if c.evictFn != nil {
					c.evictFn(k, item.value)
				}
				delete(items, k)
				break
			}
		}

		items[key] = &LocalCacheItem[Value]{value: value, expiration: expiration}
	}
}

func (c *LocalCache[Key, Value]) Close() {
	close(c.ops)
}

func (c *LocalCache[Key, Value]) Len() int {
	return len(c.items)
}
