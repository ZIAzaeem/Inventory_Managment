'use client'

import { useState, useEffect } from 'react';
import { deleteDoc, doc, setDoc, getDoc, getDocs, collection, query } from 'firebase/firestore';
import { Stack, Box, Button, Modal, TextField, Typography } from '@mui/material';
import { firestore } from '../../firebase';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch inventory items from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // Add a new item to inventory
  const addItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  // Remove an item from inventory
  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  // Handle add item modal open
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Add a new item via modal
  const handleAddNewItem = () => {
    if (itemName.trim()) {
      addItem(itemName);
      setItemName('');
      handleClose();
    }
  };

  // Handle adding 1 to an item's quantity
  const handleAddQuantity = async (item) => {
    await addItem(item);
  };

  // Handle deleting an item
  const handleDeleteItem = async (item) => {
    await removeItem(item);
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          bgcolor="white"
          border="1px solid #333"
          width={400}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add item</Typography>
          <TextField
            variant="outlined"
            fullWidth
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Quantity"
            type="number"
            value="1"
            disabled
          />
          <Button
            variant="outlined"
            onClick={handleAddNewItem}
          >
            Add New Item
          </Button>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>

      <Box width="800px" height="100px" bgcolor="blue" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h2" color="black">Pantry Tracker</Typography>
      </Box>

      <Stack width="800px" height="300px" spacing={2} sx={{ overflowY: 'auto' }}>
        {inventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="50px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#f0f0f0"
            paddingX={5}
          >
            <Typography variant="h6" color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h6" color="#333" textAlign="center">
              Quantity: {quantity}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => handleAddQuantity(name)}>
                Add +1
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDeleteItem(name)}>
                Delete
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}


