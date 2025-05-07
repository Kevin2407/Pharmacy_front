import axios from 'axios';

const URL_BASE = import.meta.env.VITE_API_URL;
console.log('URL_BASE: ', URL_BASE);

class UserService {

  async findAll() {
    return axios.get(`${URL_BASE}/usuario`);
  }

  async findById(id: number) {
    return await axios.get(`${URL_BASE}/usuario/${id}`);
  }

  async create(data: object) {
    return await axios.post(`${URL_BASE}/usuario`, data);
  }

  async update(id: number, data: object) {
    return await axios.put(`${URL_BASE}/usuario/${id}`, data);
  }

  async delete(id: number) {
    return await axios.delete(`${URL_BASE}/usuario/${id}`);
  }

}

export default new UserService();