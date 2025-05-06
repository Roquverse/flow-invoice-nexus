-- Add payment_percentage and payment_amount columns to quotes table
ALTER TABLE quotes 
ADD COLUMN payment_percentage NUMERIC DEFAULT 100.0;

ALTER TABLE quotes 
ADD COLUMN payment_amount NUMERIC DEFAULT 0.0;

-- Remove payment_plan column from invoices table (if it exists)
ALTER TABLE invoices 
DROP COLUMN IF EXISTS payment_plan;

-- First check if payment_plan column exists in quotes table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'quotes'
        AND column_name = 'payment_plan'
    ) THEN
        -- Update existing quotes to set payment_percentage based on payment_plan
        UPDATE quotes 
        SET payment_percentage = 
            CASE 
                WHEN payment_plan = 'full' THEN 100.0
                WHEN payment_plan = 'part' THEN 50.0
                ELSE 100.0
            END;
            
        -- Update payment_amount to be calculated from total_amount and payment_percentage
        UPDATE quotes 
        SET payment_amount = (total_amount * payment_percentage / 100);
    ELSE
        -- If payment_plan doesn't exist, set default values for all quotes
        UPDATE quotes 
        SET payment_percentage = 100.0,
            payment_amount = total_amount;
    END IF;
END $$; 