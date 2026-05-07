const mongoose=require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    logId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type:String
    },

    title: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    comments: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        userName:{
          type: String
        },
        comment: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Blog", blogSchema);