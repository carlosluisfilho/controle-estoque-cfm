// amazonq-ignore-next-line
const { BaseRepository } = require('../utils/dbFactory');
const { dbQuery, dbGet, dbRun } = require('../utils/dbUtils');

class FoodRepository extends BaseRepository {
  constructor() {
    super('food');
  }

  async findByName(name) {
    const sql = name ? "SELECT * FROM food WHERE name LIKE ?" : "SELECT * FROM food";
    const params = name ? [`%${name}%`] : [];
    return await dbQuery(sql, params);
  }

  async findByNameExact(name) {
    return await dbGet("SELECT * FROM food WHERE name = ?", [name]);
  }

  async incrementQuantity(id, amount) {
    await dbRun('UPDATE food SET quantity = quantity + ? WHERE id = ?', [amount, id]);
  }
}

module.exports = new FoodRepository();