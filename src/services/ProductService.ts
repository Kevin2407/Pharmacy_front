import axios from 'axios';

const URL_BASE = import.meta.env.VITE_API_URL;
console.log('URL_BASE: ', URL_BASE);

class ProductService {

  async findAll() {
    return axios.get(`${URL_BASE}/producto`);
  }

  async findById(id: number) {
    return await axios.get(`${URL_BASE}/producto/${id}`);
  }

  async create(data: object) {
    return await axios.post(`${URL_BASE}/producto`, data);
  }

  async update(id: number, data: object) {
    return await axios.put(`${URL_BASE}/producto/${id}`, data);
  }

  async delete(id: number) {
    return await axios.delete(`${URL_BASE}/producto/${id}`);
  }

  async findAllStockProducts() {
    const response = await axios.get(`${URL_BASE}/producto/stock`);
    console.log("STOCK DATA", response);
    return response;
  }

}

export default new ProductService();