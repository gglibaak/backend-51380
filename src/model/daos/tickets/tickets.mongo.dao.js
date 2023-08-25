const TicketsSchema = require('../../schemas/tickets.schema');

class TicketsDAO {
  async getAll() {
    try {
      const tickets = await TicketsSchema.find({});
      return tickets;
    } catch (error) {
      console.log(error);
    }
  }

  async getBy(query) {
    try {
      const res = await TicketsSchema.find(query);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      let ticket;
      ticket = await TicketsSchema.findOne({ _id: id }).lean();
      return ticket;
    } catch (error) {
      console.log(error);
    }
  }

  async add(ticket) {
    try {
      const newTicket = await TicketsSchema.create(ticket);
      return newTicket;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, ticket) {}

  async delete(id) {}
}

module.exports = TicketsDAO;
