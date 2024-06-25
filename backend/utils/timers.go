package utils

import (
	"reflect"
	"time"
)

func SetInterval(p interface{}, interval time.Duration) chan<- bool {
	ticker := time.NewTicker(interval)
	stopIt := make(chan bool)

	go func() {
		for {
			select {
			case <-stopIt:
				// fmt.Println("stop setInterval")
				return
			case <-ticker.C:
				reflect.ValueOf(p).Call([]reflect.Value{})
			}
		}
	}()

	return stopIt // return the bool channel to use it as a stopper
}

func ClearInterval(stopIt chan<- bool) {
	stopIt <- true
}

func SetTimeout(p interface{}, interval time.Duration) chan<- bool {
	ticker := time.NewTicker(interval)
	stopIt := make(chan bool)

	go func() {
		select {
		case <-stopIt:
			// fmt.Println("stop setTimeout")
			return
		case <-ticker.C:
			reflect.ValueOf(p).Call([]reflect.Value{})
		}
	}()

	return stopIt
}

func ClearTimeout(stopIt chan<- bool) {
	stopIt <- true
}
