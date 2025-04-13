import axios from 'axios';

const URL_BASE = import.meta.env.VITE_API_URL + "/categoria";
console.log('URL_BASE: ', URL_BASE);

class CategoryService {

  async findAll() {
    return axios.get(`${URL_BASE}`);
  }

  async findById(id: number) {
    return await axios.get(`${URL_BASE}/${id}`);
  }

  async create(data: object) {
    return await axios.post(`${URL_BASE}`, data);
  }

  async update(id: number, data: object) {
    return await axios.put(`${URL_BASE}/${id}`, data);
  }

  async delete(id: number) {
    return await axios.delete(`${URL_BASE}/${id}`);
  }

}

export default new CategoryService();