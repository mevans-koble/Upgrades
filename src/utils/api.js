import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. READ
export const fetchExcelData = async () => {
  try {
    const { data, error } = await supabase.from('Upgrades').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error pulling data:", error);
    return []; 
  }
};

// 2. CREATE
export const createUpgrade = async (upgradeData) => {
  try {
    const { data, error } = await supabase
      .from('Upgrades')
      .insert([upgradeData])
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating record:", error);
    throw error;
  }
};

// 3. UPDATE
export const updateUpgrade = async (id, updatedFields) => {
  try {
    const { data, error } = await supabase
      .from('Upgrades')
      .update(updatedFields)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};

// 4. DELETE
export const deleteUpgrade = async (id) => {
  try {
    const { error } = await supabase
      .from('Upgrades')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};