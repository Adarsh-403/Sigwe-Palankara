import os

user_panel_path = "e:/sA/Sigwe/frontend/src/pages/UserPanel.jsx"
with open(user_panel_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("const [orderComplete, setOrderComplete] = useState(null);", "const [orderComplete, setOrderComplete] = useState(null);\n  const [loading, setLoading] = useState(true);")

fetch_old = """  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };"""
fetch_new = """  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };"""
content = content.replace(fetch_old, fetch_new)

main_old = """  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.length === 0 ? ("""
main_new = """  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {loading ? (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-[#72796e] font-medium">Loading products...</p>
      </div>
    ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.length === 0 ? ("""
content = content.replace(main_old, main_new)

main_end_old = """        </div>
      ))}
    </div>
  </main>"""
main_end_new = """        </div>
      ))}
    </div>
    )}
  </main>"""
content = content.replace(main_end_old, main_end_new)

with open(user_panel_path, "w", encoding="utf-8") as f:
    f.write(content)
print("UserPanel patched!")

prod_mgmt_path = "e:/sA/Sigwe/frontend/src/pages/admin/ProductManagement.jsx"
with open(prod_mgmt_path, "r", encoding="utf-8") as f:
    content2 = f.read()

content2 = content2.replace("const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: '' });", "const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: '' });\n  const [loading, setLoading] = useState(true);")

fetch2_old = """  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };"""
fetch2_new = """  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };"""
content2 = content2.replace(fetch2_old, fetch2_new)

table_old = """          <tbody className="divide-y divide-gray-100 ">
            {products.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-6 text-gray-500">No products found. Add some!</td></tr>
            ) : products.map((product) => ("""
table_new = """          <tbody className="divide-y divide-gray-100 ">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-12"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-2"></div><p className="text-gray-500 text-sm">Loading products...</p></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-6 text-gray-500">No products found. Add some!</td></tr>
            ) : products.map((product) => ("""
content2 = content2.replace(table_old, table_new)

with open(prod_mgmt_path, "w", encoding="utf-8") as f:
    f.write(content2)
print("ProductManagement patched!")
