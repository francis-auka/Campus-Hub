
import { supabase } from "@/integrations/supabase/client";

// Safe type assertion function to handle potential database issues
export const safelyHandleData = <T>(data: any): T[] => {
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  return data as T[];
};

// Check if a table or column exists by catching and analyzing error patterns
export const checkIfExists = async (
  checkType: 'table' | 'column',
  tableName: string, 
  columnName?: string
): Promise<boolean> => {
  try {
    if (checkType === 'table') {
      // Type assertion to bypass TypeScript restrictions for tables that might not exist
      const { error } = await supabase
        .from(tableName as any)
        .select('*')
        .limit(1);
        
      if (error && error.message?.includes(`relation "${tableName}" does not exist`)) {
        console.log(`Table '${tableName}' does not exist`);
        return false;
      }
    } else if (checkType === 'column' && columnName) {
      // This is also fixed by using the proper type assertion
      const { error } = await supabase
        .from(tableName as any)
        .select(columnName)
        .limit(1);
        
      if (error && error.message?.includes(`column '${columnName}' does not exist`)) {
        console.log(`Column '${columnName}' in table '${tableName}' does not exist`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking if ${checkType} ${columnName || tableName} exists:`, error);
    return false;
  }
};

// Check if the column exists in the table
export const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  return checkIfExists('column', tableName, columnName);
};

// Check if a table exists
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  return checkIfExists('table', tableName);
};
