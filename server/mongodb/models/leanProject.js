import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;


const LeanProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: { type: String, default: "A3" }, // A3, PDCA, DMAIC, custom
  visibility: { type: String, default: "private" }, // public/private
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  authorName: String,
  aiAnalysis: { type: String },

  principles: [String],
  keywords: [String],
  files: [String], // посилання на завантажені файли
  links: [String], // зовнішні посилання

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["admin", "user"], default: "user" },
    },
  ],

  accessLevel: { type: String, enum: ["owner", "team", "admin"], default: "owner" },
  priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },

  startDate: Date,
  endDate: Date,
  milestones: [
    {
      name: String,
      date: Date,
    },
  ],

  expectedResults: String,
  kpi: [String],
  costEstimation: String,

  extra5S: {
    sort: String,
    setInOrder: String,
    shine: String,
    standardize: String,
    sustain: String,
  },

  leanTemplates: {
    fiveS: {
      sort: [
        {
          object: String,
          status: String,
          reason: String,
        },
      ],
      setInOrder: [
        {
          object: String,
          location: String,
          labeling: String,
        },
      ],
      shine: [
        {
          zone: String,
          responsible: String,
          frequency: String,
        },
      ],
      standardize: [
        {
          procedure: String,
          instruction: String,
          visual: String,
        },
      ],
      sustain: [
        {
          date: String,
          responsible: String,
          comment: String,
        },
      ],
    },
    kanban: [
      {
        title: String,
        status: {
          type: String,
          enum: ["backlog", "todo", "in_progress", "review", "done"],
          default: "backlog"
        },
        assignedTo: String,
        dueDate: Date,
      },
    ],
    leanCanvas: {
        problem: String,
        kanbanColumns: [String],
        existingAlternatives: String,
        solution: String,
        keyMetrics: String,
        uniqueValue: String,
        highLevelConcept: String,
        unfairAdvantage: String,
        customerSegments: String,
        earlyAdopters: String,
        channels: String,
        costStructure: String,
        revenueStreams: String,
      },
    kaizen: {
      ideas: [
        {
          idea: String,
          author: {
            _id: mongoose.Schema.Types.ObjectId,
            email: String
          },
          criticality: Number,
          status: String,
          date: String,
          comment: String,
          likes: [{ type: Types.ObjectId, ref: 'User' }],
          dislikes: [{ type: Types.ObjectId, ref: 'User' }]
        },
      ],
      plan: [
        {
          action: String,
          responsible: String,
          deadline: Date,
          done: String, // можно сделать Boolean, но пока оставим строкой для простоты
        },
      ],
      beforeAfter: {
        before: String,
        after: String,
        beforeImages: [String],
        afterImages: [String],
      },
      effect: [
        {
          metric: String,
          before: String,
          after: String,
          comment: String,
        },
      ],
    },
    audit: [
      {
        type: { type: String },
        location: { type: String },
        dateDetected: { type: String },
        severity: { type: String },
        comment: { type: String },
        responsible: {
          _id: { type: mongoose.Schema.Types.ObjectId },
          name: String,
          email: String,
        },
      }
    ],
  },
});

export default mongoose.model("LeanProject", LeanProjectSchema);
