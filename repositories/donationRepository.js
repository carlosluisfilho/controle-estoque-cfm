const { BaseRepository } = require('../utils/dbFactory');
const { dbQuery } = require('../utils/dbUtils');

class DonationRepository extends BaseRepository {
  constructor() {
    super('donation');
  }

  async findAllWithFood() {
    return await dbQuery(`
      SELECT donation.id, food.name AS food_name, donation.quantity, donation.donor_name,
             donation.reference, donation.expiration, donation.donation_date
      FROM donation JOIN food ON donation.food_id = food.id
      ORDER BY donation.donation_date DESC
    `);
  }
}

module.exports = new DonationRepository();