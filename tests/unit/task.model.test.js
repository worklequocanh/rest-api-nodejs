const taskModel = require('../../src/models/task.model');
const db = require('../../src/config/database');

jest.mock('../../src/config/database');

describe('TaskModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should build correct query with filters and pagination', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // tasks
      db.query.mockResolvedValueOnce({ rows: [{ count: '0' }] }); // count

      const result = await taskModel.findAll(1, { 
        status: 'todo', 
        priority: 'high', 
        page: 2, 
        limit: 5 
      });

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1 AND status = $2 AND priority = $3'),
        [1, 'todo', 'high', 5, 5]
      );
      expect(result.meta.page).toBe(2);
    });
  });

  describe('update', () => {
    it('should build correct update query', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1 }] });
      const result = await taskModel.update(1, 1, { title: 'New', status: 'done' });
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE tasks SET title = $3, status = $4'),
        [1, 1, 'New', 'done']
      );
    });

    it('should return null if no fields provided', async () => {
      const result = await taskModel.update(1, 1, {});
      expect(result).toBeNull();
    });
  });
});
