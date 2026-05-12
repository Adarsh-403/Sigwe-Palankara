const fs = require('fs');

const userPanelPath = 'e:/sA/Sigwe/frontend/src/pages/UserPanel.jsx';
let content = fs.readFileSync(userPanelPath, 'utf8');

content = content.replace("const [orderComplete, setOrderComplete] = useState(null);", "const [orderComplete, setOrderComplete] = useState(null);\n  const [loading, setLoading] = useState(true);");

const fetchOld = `  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };`;
const fetchNew = `  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };`;
content = content.replace(fetchOld, fetchNew);

const mainOld = `  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.length === 0 ? (`
const mainNew = `  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {loading ? (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-[#72796e] font-medium">Loading products...</p>
      </div>
    ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.length === 0 ? (`
content = content.replace(mainOld, mainNew);

const mainEndOld = `        </div>
      ))}
    </div>
  </main>`;
const mainEndNew = `        </div>
      ))}
    </div>
    )}
  </main>`;
content = content.replace(mainEndOld, mainEndNew);

fs.writeFileSync(userPanelPath, content, 'utf8');
console.log("UserPanel patched!");

const prodMgmtPath = 'e:/sA/Sigwe/frontend/src/pages/admin/ProductManagement.jsx';
let content2 = fs.readFileSync(prodMgmtPath, 'utf8');

content2 = content2.replace("const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: '' });", "const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: '' });\n  const [loading, setLoading] = useState(true);");

content2 = content2.replace(fetchOld, fetchNew);

const tableOld = `          <tbody className="divide-y divide-gray-100 ">
            {products.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-6 text-gray-500">No products found. Add some!</td></tr>
            ) : products.map((product) => (`
const tableNew = `          <tbody className="divide-y divide-gray-100 ">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-12"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-2"></div><p className="text-gray-500 text-sm">Loading products...</p></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-6 text-gray-500">No products found. Add some!</td></tr>
            ) : products.map((product) => (`
content2 = content2.replace(tableOld, tableNew);

fs.writeFileSync(prodMgmtPath, content2, 'utf8');
console.log("ProductManagement patched!");
