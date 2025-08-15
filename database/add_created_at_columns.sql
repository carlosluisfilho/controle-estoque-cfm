-- Adiciona coluna created_at nas tabelas, sem valor padrão (por compatibilidade)
ALTER TABLE food ADD COLUMN created_at DATETIME;
ALTER TABLE donation ADD COLUMN created_at DATETIME;
ALTER TABLE distribution ADD COLUMN created_at DATETIME;

-- Preenche a nova coluna com o timestamp atual onde estiver NULL
UPDATE food SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
UPDATE donation SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
UPDATE distribution SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
