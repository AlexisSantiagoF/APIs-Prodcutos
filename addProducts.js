const admin = require("firebase-admin");

// Inicializar Firebase Admin con tu clave privada
const serviceAccount = require("./firebaseConfig.json"); // Reemplaza con la ruta correcta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const productsCollection = db.collection("products");

// Datos de productos
const products = [
  {
    id: "3",
    nombre: "Laptop HP",
    enStock: true,
    categoria: "Electrónica",
    detalles: {
      procesador: "Intel i7",
      ram: "16GB",
      almacenamiento: "512GB SSD"
    },
    precio: 1200,
    historialPrecios: [
      { fecha: "2024-02-20T08:00:00Z", precioAnterior: 15999.99 },
      { fecha: "2024-03-01T08:00:00Z", precioAnterior: 14999.99 },
      { fecha: "2025-03-04T20:19:27.613Z", precioAnterior: 14999.99 },
      { fecha: "2025-03-04T20:26:35.655Z", precioAnterior: 13999.99 }
    ]
  },
  {
    id: "4",
    nombre: "Mouse Logitech MX Master 3",
    enStock: true,
    categoria: "Accesorios",
    detalles: {
      tipo: "Inalámbrico",
      dpi: "4000"
    },
    precio: 120,
    historialPrecios: [
      { fecha: "2024-02-15T08:00:00Z", precioAnterior: 130 },
      { fecha: "2024-03-01T10:30:00Z", precioAnterior: 125 }
    ]
  },
  {
    id: "5",
    nombre: "Teclado Mecánico Redragon",
    enStock: true,
    categoria: "Accesorios",
    detalles: {
      tipo: "Mecánico",
      switches: "Red"
    },
    precio: 80,
    historialPrecios: [
      { fecha: "2024-02-20T08:00:00Z", precioAnterior: 90 }
    ]
  },
  {
    id: "6",
    nombre: "Monitor LG UltraWide 29\"",
    enStock: true,
    categoria: "Electrónica",
    detalles: {
      resolución: "2560x1080",
      tasaDeRefresco: "75Hz",
      tipoPanel: "IPS"
    },
    precio: 300,
    historialPrecios: [
      { fecha: "2024-02-25T08:00:00Z", precioAnterior: 320 }
    ]
  },
  {
    id: "7",
    nombre: "Auriculares HyperX Cloud II",
    enStock: true,
    categoria: "Accesorios",
    detalles: {
      conectividad: "Cableado",
      sonido: "7.1 Surround"
    },
    precio: 99,
    historialPrecios: [
      { fecha: "2024-03-01T08:00:00Z", precioAnterior: 110 }
    ]
  },
  {
    id: "8",
    nombre: "Smartphone Samsung Galaxy S23",
    enStock: true,
    categoria: "Electrónica",
    detalles: {
      procesador: "Snapdragon 8 Gen 2",
      ram: "8GB",
      almacenamiento: "256GB"
    },
    precio: 999,
    historialPrecios: [
      { fecha: "2024-02-18T08:00:00Z", precioAnterior: 1050 }
    ]
  }
];

// Función para agregar los productos a Firestore
const addProductsToFirestore = async () => {
  try {
    for (const product of products) {
      await productsCollection.doc(product.id).set(product);
      console.log(`Producto agregado: ${product.nombre}`);
    }
    console.log("✅ Todos los productos fueron agregados correctamente.");
  } catch (error) {
    console.error("❌ Error al agregar productos:", error);
  }
};

addProductsToFirestore();
