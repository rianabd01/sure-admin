export default async function fetchData() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/trash', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setItems(response.data.results);
    setLoading(false);
  } catch (error) {
    setError(error);
    setLoading(false);
  }
}
