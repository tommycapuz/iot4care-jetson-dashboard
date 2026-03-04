# IoT4Care React Dashboard

Dashboard web sviluppata in React per il controllo remoto di sessioni di videoregistrazione per pazienti con malattia di Parkinson.

Il sistema permette ad un operatore di avviare e fermare una pipeline di applicativi eseguiti su una scheda remota NVIDIA Jetson Orin, responsabile di:

•⁠  ⁠acquisizione video da due telecamere
•⁠  ⁠conversione dei video in dati raw
•⁠  ⁠salvataggio dei dati su storage

La dashboard fornisce un'interfaccia semplice e intuitiva per monitorare lo stato della pipeline e gestire le sessioni di registrazione.

---

## Architettura del sistema

React Dashboard  
↓  
REST API (Node.js / Express)  
↓  
Pipeline applicativi su Jetson Orin

La pipeline Jetson è simulata nel backend per scopi di sviluppo.

---

## Tecnologie utilizzate

Frontend:
•⁠  ⁠React
•⁠  ⁠TypeScript
•⁠  ⁠Vite
•⁠  ⁠Axios

Backend:
•⁠  ⁠Node.js
•⁠  ⁠Express
•⁠  ⁠REST API

---

## Funzionalità principali

La dashboard permette di:

•⁠  ⁠avviare una sessione di registrazione
•⁠  ⁠fermare una sessione di registrazione
•⁠  ⁠monitorare lo stato della pipeline
•⁠  ⁠visualizzare lo stato dei componenti:
  - Camera 1
  - Camera 2
  - Conversione video
  - Storage
•⁠  ⁠visualizzare i log della sessione in tempo reale
•⁠  ⁠scaricare i log della sessione

---

## Struttura del progetto

iot4care-jetson-dashboard

backend  
├── index.js  
├── package.json  

frontend  
├── src  
│ ├── components  
│ │ ├── LogPanel.tsx  
│ │ └── StatusCards.tsx  
│ ├── api.ts  
│ └── App.tsx  

docs  
└── relazione.pdf

README.md

---

## Installazione

### Backend

Entrare nella cartella backend:

cd backend

Installare le dipendenze:

npm install

Avviare il server:

npm run dev

Il backend sarà disponibile su:

http://localhost:3001

---

### Frontend

Entrare nella cartella frontend:

cd frontend

Installare le dipendenze:

npm install

Avviare il server di sviluppo:

npm run dev

La dashboard sarà disponibile su:

http://localhost:5173

---

## API principali

GET /api/session/status  
POST /api/session/start  
POST /api/session/stop  
GET /api/logs  
GET /api/logs/download  

---

## Note

La pipeline Jetson è simulata nel backend per permettere lo sviluppo della dashboard anche senza accesso diretto alla scheda NVIDIA Jetson Orin.

---

## Autore

Progetto sviluppato per il corso *Progettazione di App React*.