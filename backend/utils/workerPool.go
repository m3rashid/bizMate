package utils

import "sync"

type Task interface {
	Process()
}

type WorkerPool struct {
	Tasks        []Task
	concurrency  int
	tasksChannel chan Task
	wg           sync.WaitGroup
}

func (wp *WorkerPool) worker() {
	for task := range wp.tasksChannel {
		task.Process()
		wp.wg.Done()
	}
}

func NewWorkerPool(tasks []Task, concurrency int) *WorkerPool {
	return &WorkerPool{Tasks: tasks, concurrency: concurrency}
}

func (pool *WorkerPool) Run() {
	pool.tasksChannel = make(chan Task, len(pool.Tasks))

	for i := 0; i < pool.concurrency; i++ {
		go pool.worker()
	}

	pool.wg.Add(len(pool.Tasks))
	for _, task := range pool.Tasks {
		pool.tasksChannel <- task
	}

	close(pool.tasksChannel)
	pool.wg.Wait()
}
