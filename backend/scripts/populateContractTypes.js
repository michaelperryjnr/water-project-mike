const mongoose = require('mongoose');
const ContractType = require('../models/ContractType');
const {CONFIG} = require("../config/core")


// MongoDB connection
mongoose.connect(CONFIG.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


//Employment Contracts
const contractTypes = [
    // Employment Contracts
    {
      contractTypeName: 'permanent',
      contractTypeDescription: 'An ongoing employment contract with no fixed end date, subject to termination clauses.',
      duration: null,
      durationUnit: null
    },
    {
      contractTypeName: 'fixed-term',
      contractTypeDescription: 'A temporary employment contract for a specific period or project.',
      duration: 12,
      durationUnit: 'months'
    },
    {
      contractTypeName: 'part-time',
      contractTypeDescription: 'An employment contract with fewer working hours than full-time.',
      duration: null,
      durationUnit: null
    },
    {
      contractTypeName: 'casual',
      contractTypeDescription: 'A flexible, on-call employment contract with no guaranteed hours.',
      duration: null,
      durationUnit: null
    },
    {
      contractTypeName: 'apprenticeship',
      contractTypeDescription: 'A contract combining work and training for skill development.',
      duration: 24,
      durationUnit: 'months'
    },
    {
      contractTypeName: 'zero-hour',
      contractTypeDescription: 'An employment contract with no guaranteed hours, flexible for both parties.',
      duration: null,
      durationUnit: null
    },
    {
      contractTypeName: 'probationary',
      contractTypeDescription: 'A trial period within a permanent contract to assess performance.',
      duration: 3,
      durationUnit: 'months'
    },
    {
      contractTypeName: 'temporary-agency',
      contractTypeDescription: 'An employment contract through a staffing agency for temporary work.',
      duration: 6,
      durationUnit: 'months'
    },
  
    // Contractor Agreements
    {
      contractTypeName: 'independent-contractor',
      contractTypeDescription: 'An agreement with a self-employed individual for specific tasks.',
      duration: null,
      durationUnit: null
    },
    {
      contractTypeName: 'fixed-price',
      contractTypeDescription: 'A contractor agreement based on completing a defined scope for a fixed fee.',
      duration: 3,
      durationUnit: 'months'
    },
    {
      contractTypeName: 'time-and-materials',
      contractTypeDescription: 'A contractor agreement based on hours worked and materials used.',
      duration: null,
      durationUnit: null
    },
    {
      contractTypeName: 'retainer',
      contractTypeDescription: 'A recurring payment for a contractor to be available for work.',
      duration: 12,
      durationUnit: 'months'
    },
    {
      contractTypeName: 'subcontractor',
      contractTypeDescription: 'An agreement with a contractor who hires others to complete work.',
      duration: 6,
      durationUnit: 'months'
    },
    {
      contractTypeName: 'project-based',
      contractTypeDescription: 'A one-off contractor agreement for a specific project.',
      duration: 4,
      durationUnit: 'weeks'
    },
  
    // Hybrid/Specialized Contracts
    {
      contractTypeName: 'consulting',
      contractTypeDescription: 'An agreement with a professional for expert advice.',
      duration: 3,
      durationUnit: 'months'
    },
    {
      contractTypeName: 'internship',
      contractTypeDescription: 'A contract for students or trainees to gain experience.',
      duration: 2,
      durationUnit: 'months'
    },
    {
      contractTypeName: 'joint-venture',
      contractTypeDescription: 'A collaborative agreement with shared risks and rewards.',
      duration: 12,
      durationUnit: 'months'
    }
  ];

  async function populateContractTypes () {
    try {
        //clear existing contract types
        await ContractType.deleteMany({});

        //Insert new contract types
        const result = await ContractType.insertMany(contractTypes);
        console.log(`${result.length} contract types have been added to the database`)
    } catch (error) {
        console.error('Error populating contract types:', error);
    } finally {
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
  }

  populateContractTypes();