import axios from 'axios';

const URL_BASE = import.meta.env.VITE_API_URL;
console.log('URL_BASE: ', URL_BASE);

class RoleService {

  async findAll() {
    return axios.get(`${URL_BASE}/rol`);
  }

  async findById(id: number) {
    return await axios.get(`${URL_BASE}/rol/${id}`);
  }

  async create(data: object) {
    return await axios.post(`${URL_BASE}/rol`, data);
  }

  async update(id: number, data: object) {
    return await axios.put(`${URL_BASE}/rol/${id}`, data);
  }

  async delete(id: number) {
    return await axios.delete(`${URL_BASE}/rol/${id}`);
  }

}

export default new RoleService();