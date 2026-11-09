const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();

    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during creating issue: ", err.message);
    res.status(500).send("Server error!");
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, decription, status } = req.body;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    issue.title = title;
    issue.description = descrition;
    issue.status = status;

    await issue.save();

    res.json(issue, {message:"Issue updated!"});
  } catch (err) {
    console.error("Error during issue updation: ", err.message);
    res.status(500).send("Server error!");
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
  } catch (err) {
    console.error("Error during issue deletion: ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getAllIssues(req, res) {
  const { id } = req.params;
  try {
    const issue = Issue.find({ repository: id });

    if (!issue) {
      return res.status(404).json({ error: "Issue not founf!" });
    }

    res.status(200).json(issue);
  } catch (err) {
    console.error("Error during issue fetching: ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getIssuesById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue fetching by id: ", err.message);
    res.status(500).send("Server error!");
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssuesById,
};
