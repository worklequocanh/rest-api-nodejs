const taskService = require('../../src/services/task.service');
const taskModel = require('../../src/models/task.model');

jest.mock('../../src/models/task.model');

describe('TaskService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = { title: 'New Task' };
      taskModel.create.mockResolvedValue({ id: 1, ...taskData });

      const result = await taskService.createTask(1, taskData);

      expect(result.id).toBe(1);
      expect(taskModel.create).toHaveBeenCalledWith(1, taskData);
    });
  });

  describe('getTaskById', () => {
    it('should return task if found', async () => {
      taskModel.findById.mockResolvedValue({ id: 1, title: 'Task 1' });

      const result = await taskService.getTaskById(1, 1);

      expect(result.title).toBe('Task 1');
    });

    it('should throw error if task not found', async () => {
      taskModel.findById.mockResolvedValue(null);

      await expect(taskService.getTaskById(99, 1)).rejects.toThrow('Task not found');
    });
  });

  describe('getAllTasks', () => {
    it('should return tasks with meta', async () => {
      const mockResult = { tasks: [], meta: {} };
      taskModel.findAll.mockResolvedValue(mockResult);

      const result = await taskService.getAllTasks(1, {});
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      taskModel.update.mockResolvedValue({ id: 1, title: 'Updated' });
      const result = await taskService.updateTask(1, 1, { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });

    it('should throw if task not found or not owned', async () => {
      taskModel.update.mockResolvedValue(null);
      await expect(taskService.updateTask(99, 1, { title: 'X' }))
        .rejects.toThrow('Task not found or not authorized to update');
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      taskModel.deleteById.mockResolvedValue(true);
      const result = await taskService.deleteTask(1, 1);
      expect(result).toBe(true);
    });

    it('should throw if task not found or not owned', async () => {
      taskModel.deleteById.mockResolvedValue(false);
      await expect(taskService.deleteTask(99, 1))
        .rejects.toThrow('Task not found or not authorized to delete');
    });
  });
});
