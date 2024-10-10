let db;

// Ouvrir ou créer la base de données IndexedDB
const request = indexedDB.open('ProductCatalog', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('price', 'price', { unique: false });
    objectStore.createIndex('category', 'category', { unique: false });
};

// Connexion réussie à IndexedDB
request.onsuccess = function(event) {
    db = event.target.result;
    displayProducts(); // Afficher les produits lors du chargement
};

request.onerror = function(event) {
    console.error('Erreur lors de l\'ouverture de la base de données', event.target.errorCode);
};

// Ajouter un produit
document.getElementById('productForm').addEventListener('submit', addProduct);

function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;

    const transaction = db.transaction(['products'], 'readwrite');
    const objectStore = transaction.objectStore('products');
    objectStore.add({ name, price, category });

    transaction.oncomplete = function() {
        document.getElementById('productForm').reset();
        displayProducts();
    };

    transaction.onerror = function() {
        console.error('Erreur lors de l\'ajout du produit');
    };
}

// Afficher les produits
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    const transaction = db.transaction(['products']);
    const objectStore = transaction.objectStore('products');

    objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            const li = document.createElement('li');
            li.textContent = `${cursor.value.name} - ${cursor.value.price} € - ${cursor.value.category}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.onclick = () => deleteProduct(cursor.value.id);

            const editButton = document.createElement('button');
            editButton.textContent = 'Modifier';
            editButton.onclick = () => loadProduct(cursor.value);

            li.appendChild(editButton);
            li.appendChild(deleteButton);
            productList.appendChild(li);

            cursor.continue();
        } else {
            console.log('Tous les produits ont été affichés');
        }
    };
}

// Charger un produit pour modification
function loadProduct(product) {
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productId').value = product.id;

    document.getElementById('addProductButton').style.display = 'none';
    document.getElementById('updateProductButton').style.display = 'inline';
    document.getElementById('updateProductButton').onclick = updateProduct;
}

// Mettre à jour un produit
function updateProduct() {
    const id = parseInt(document.getElementById('productId').value);
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;

    const transaction = db.transaction(['products'], 'readwrite');
    const objectStore = transaction.objectStore('products');
    objectStore.put({ id, name, price, category });

    transaction.oncomplete = function() {
        document.getElementById('productForm').reset();
        document.getElementById('addProductButton').style.display = 'inline';
        document.getElementById('updateProductButton').style.display = 'none';
        displayProducts();
    };

    transaction.onerror = function() {
        console.error('Erreur lors de la mise à jour du produit');
    };
}

// Supprimer un produit
function deleteProduct(id) {
    const transaction = db.transaction(['products'], 'readwrite');
    const objectStore = transaction.objectStore('products');
    objectStore.delete(id);

    transaction.oncomplete = function() {
        displayProducts();
    };

    transaction.onerror = function() {
        console.error('Erreur lors de la suppression du produit');
    };
}
