// scripts/seed.js
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI if needed
const client = new MongoClient(uri);

async function seedDB() {
    try {
        await client.connect();
        const db = client.db('jerseyStore');

        // 1. Seed Jerseys
        const jerseysCollection = db.collection('jerseys');
        const sampleJerseys = [
            {
                name: "Team A Home Jersey",
                team: "Team A",
                price: 49.99,
                size: "M",
                stock: 100,
                description: "The official Team A home jersey for the 2024 season."
            },
            {
                name: "Team B Away Jersey",
                team: "Team B",
                price: 54.99,
                size: "L",
                stock: 75,
                description: "The official Team B away jersey for the 2024 season."
            },
            {
                name: "Team C Third Jersey",
                team: "Team C",
                price: 59.99,
                size: "S",
                stock: 50,
                description: "A unique third jersey for Team C."
            }
        ];

        await jerseysCollection.deleteMany({});
        await jerseysCollection.insertMany(sampleJerseys);
        console.log('Sample jerseys inserted successfully.');

        // 2. Seed Users
        const usersCollection = db.collection('users');
        const passwordHash = await bcrypt.hash('password123', 10);
        const sampleUsers = [
            {
                username: "john_doe",
                email: "john@example.com",
                password: passwordHash,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                username: "jane_smith",
                email: "jane@example.com",
                password: passwordHash,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await usersCollection.deleteMany({});
        await usersCollection.insertMany(sampleUsers);
        console.log('Sample users inserted successfully.');

        // 3. Seed Carts
        const cartsCollection = db.collection('carts');
        const sampleCarts = [
            {
                userId: new ObjectId(sampleUsers[0]._id), // Link to first user
                items: [
                    { itemId: new ObjectId(sampleJerseys[0]._id), quantity: 2 },
                    { itemId: new ObjectId(sampleJerseys[1]._id), quantity: 1 }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: new ObjectId(sampleUsers[1]._id), // Link to second user
                items: [
                    { itemId: new ObjectId(sampleJerseys[2]._id), quantity: 1 }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await cartsCollection.deleteMany({});
        await cartsCollection.insertMany(sampleCarts);
        console.log('Sample carts inserted successfully.');

        // 4. Seed Orders
        const ordersCollection = db.collection('orders');
        const sampleOrders = [
            {
                userId: new ObjectId(sampleUsers[0]._id), // Link to first user
                items: [
                    { itemId: new ObjectId(sampleJerseys[0]._id), quantity: 1 },
                    { itemId: new ObjectId(sampleJerseys[1]._id), quantity: 2 }
                ],
                createdAt: new Date(),
                status: 'pending'
            },
            {
                userId: new ObjectId(sampleUsers[1]._id), // Link to second user
                items: [
                    { itemId: new ObjectId(sampleJerseys[2]._id), quantity: 2 }
                ],
                createdAt: new Date(),
                status: 'shipped'
            }
        ];

        await ordersCollection.deleteMany({});
        await ordersCollection.insertMany(sampleOrders);
        console.log('Sample orders inserted successfully.');

    } catch (error) {
        console.error('Error inserting sample data:', error);
    } finally {
        await client.close();
    }
}

seedDB();
