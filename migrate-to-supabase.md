# Migrer til Supabase Database - Steg for steg

## 1. Opprett Supabase konto og database
- Gå til supabase.com
- "Start for free" (ingen kredittkort nødvendig)
- Opprett nytt prosjekt med ønsket navn
- Husk database-passordet du setter

## 2. Hent tilkoblingsdetaljer fra Supabase
Settings → Database → Connection string:
```
postgresql://postgres:[DITT_PASSORD]@db.[PROSJEKT_ID].supabase.co:5432/postgres
```

## 3. Oppdater miljøvariabler i Replit
Secrets → DATABASE_URL → Erstatt med ny Supabase URL

## 4. Migrer schema og data
```bash
# Eksporter nåværende data
pg_dump $OLD_DATABASE_URL --no-owner --no-privileges > backup.sql

# Importer til Supabase
psql $NEW_DATABASE_URL < backup.sql

# Eller bruk npm run db:push for schema
npm run db:push
```

## 5. Test tilkoblingen
- Start applikasjonen
- Verifiser at data vises korrekt
- Test innlogging og alle funksjoner

## Supabase gratis tier:
- ✅ 500MB database
- ✅ 2 simultane tilkoblinger  
- ✅ Full PostgreSQL støtte
- ✅ Automatiske backups
- ✅ Dashboard for administrasjon

## Fallback plan:
Hvis Supabase ikke fungerer, bruk backup.sql til å gjenopprette til:
- Neon (512MB gratis)
- Railway ($5 gratis kreditt)
- ElephantSQL (20MB gratis)