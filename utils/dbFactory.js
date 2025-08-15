const { dbQuery, dbGet, dbRun } = require('./dbUtils');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findAll(conditions = {}) {
    const { where, params } = this.buildWhere(conditions);
    return await dbQuery(`SELECT * FROM ${this.tableName}${where}`, params);
  }

  async findById(id) {
    return await dbGet(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async create(data) {
    const { columns, placeholders, values } = this.buildInsert(data);
    const result = await dbRun(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
      values
    );
    return { id: result.id, ...data };
  }

  async update(id, data) {
    const { set, values } = this.buildUpdate(data);
    await dbRun(`UPDATE ${this.tableName} SET ${set} WHERE id = ?`, [...values, id]);
  }

  async delete(id) {
    const result = await dbRun(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    if (result.changes === 0) {
      const entityName = this.tableName === 'donation' ? 'Doação' : 
                         this.tableName === 'distribution' ? 'Distribuição' : 
                         this.tableName === 'food' ? 'Alimento' : this.tableName;
      const gender = this.tableName === 'food' ? 'encontrado' : 'encontrada';
      const error = new Error(`${entityName} não ${gender}.`);
      error.statusCode = 404;
      throw error;
    }
  }

  buildWhere(conditions) {
    const keys = Object.keys(conditions);
    if (keys.length === 0) return { where: '', params: [] };
    
    const where = ' WHERE ' + keys.map(key => `${key} = ?`).join(' AND ');
    return { where, params: Object.values(conditions) };
  }

  buildInsert(data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    return { columns, placeholders, values };
  }

  buildUpdate(data) {
    const set = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    return { set, values };
  }
}

function createRepository(tableName) {
  return new BaseRepository(tableName);
}

module.exports = { BaseRepository, createRepository };