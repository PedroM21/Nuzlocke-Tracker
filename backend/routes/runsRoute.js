import { Router } from "express";
import prisma from "../prismaClient.js";
import runsMiddleware from "../middleware/runsMiddleware.js";

const runsRoutes = Router();

// Get all runs for a logged-in user
runsRoutes.get("/", runsMiddleware, async (req, res) => {
  try {
    const userRuns = await prisma.run.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        rundetail: true,
      },
    });
    res.json(userRuns);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch runs" });
  }
});

// Create a new run
runsRoutes.post("/new-run", runsMiddleware, async (req, res) => {
  const { runName, generation, game, type, attempt } = req.body;

  // Validate input fields
  if (!runName || !generation || !game) {
    return res.status(400).json({ error: "Missing important fields" });
  }

  try {
    // save run to database
    const run = await prisma.run.create({
      data: {
        runName,
        generation,
        game,
        type,
        attempt,
        userId: req.userId,
      },
    });
    res
      .status(201)
      .json({ message: "New run created successfully!", runId: run.id });
  } catch (err) {
    console.log(err);
    res.status(503).json({ err });
  }
});

// Create or update a ruleset
// runsRoutes.post("/:runId/ruleset", runsMiddleware, async (req, res) => {
//   const { runId } = req.params;
//   const { ruleSetText } = req.body;

//   try {
//     const run = await prisma.run.findUnique({
//       where: { id: parseInt(runId) },
//     });

//     if (!run || run.userId !== req.userId) {
//       return res.status(404).json({ error: "Run not found or unauthorized" });
//     }

//     // Create or update the ruleset for the given run
//     const ruleset = await prisma.ruleset.upsert({
//       where: { runId: parseInt(runId) },
//       update: { ruleSetText },
//       create: {
//         ruleSetText,
//         userId: req.userId,
//         run: { connect: { id: parseInt(runId) } },
//       },
//     });

//     res
//       .status(201)
//       .json({ message: "Rules created/updated successfully", ruleset });
//   } catch (err) {
//     console.log(err);
//     res.status(503).json({ err });
//   }
// });

// Create run details
runsRoutes.post("/:runId/details", runsMiddleware, async (req, res) => {
  const { runId } = req.params;
  const { location, caught, name, nickname, isAlive } = req.body;

  // Validate input fields
  if (!location || caught === undefined || !name || isAlive === undefined) {
    return res.status(400).json({ error: "Missing important fields" });
  }

  try {
    // Check if the run exists and it belongs to the user
    const run = await prisma.run.findUnique({
      where: { id: parseInt(runId) },
    });

    // if run doesnt exist or ids do not match return error
    if (!run || run.userId !== req.userId) {
      return res.status(404).json({ error: "Run not found." });
    }

    const runDetail = await prisma.runDetail.create({
      data: {
        runId: parseInt(runId),
        location,
        caught,
        name,
        nickname,
        isAlive,
      },
    });

    res
      .status(201)
      .json({ message: "Run detail added successfully", runDetail });
  } catch (err) {
    res.status(503).json({ error: "Failed to add run detail" });
  }
});

// Update run to be completed or set to active
runsRoutes.put("/:runId", runsMiddleware, async (req, res) => {
  const { completed, isActive } = req.body;
  const { runId } = req.params;

  try {
    const updateData = {};
    if (completed !== undefined) updateData.completed = !!completed;
    if (isActive !== undefined) updateData.isActive = !!isActive;

    // Check if there is a currently active run and make it false
    if (isActive) {
      await prisma.run.updateMany({
        where: {
          userId: req.userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    // Update the selected run
    const updatedRun = await prisma.run.update({
      where: {
        id: parseInt(runId),
        userId: req.userId,
      },
      data: updateData,
    });

    res.json(updatedRun);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update run" });
  }
});

// Edit run details
runsRoutes.put("/:runId/overview/:editId", runsMiddleware, async (req, res) => {
  // const { runId } = req.params;
  const { editId } = req.params;
  const { location, caught, name, nickname, isAlive } = req.body;

  try {
    // Find the existing run detail
    // console.log(editId);
    const existingDetail = await prisma.runDetail.findUnique({
      where: { id: parseInt(editId) },
    });

    if (!existingDetail) {
      return res.status(404).json({ error: "Run detail not found." });
    }

    // Update the run detail
    const updatedDetail = await prisma.runDetail.update({
      where: { id: parseInt(editId) },
      data: { location, caught, name, nickname, isAlive },
    });

    res.status(200).json(updatedDetail);
  } catch (error) {
    console.log("Error updating run details", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// Get all details for a specific run
runsRoutes.get("/:runId/overview", runsMiddleware, async (req, res) => {
  const { runId } = req.params;

  try {
    const runDetails = await prisma.run.findUnique({
      where: {
        id: parseInt(runId),
      },
      include: {
        rundetail: true,
      },
    });

    if (!runDetails) {
      return res.status(404).json({ error: "Run not found" });
    }

    res.json(runDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch run details" });
  }
});

// Delete a run
runsRoutes.delete("/:runId", async (req, res) => {
  const { runId } = req.params;

  try {
    // Check if the run exists and belongs to the authenticated user
    const existingRun = await prisma.run.findUnique({
      where: { id: parseInt(runId) },
    });

    if (!existingRun) {
      return res.status(404).json({ error: "Run not found or unauthorized" });
    }

    // first delete all associated RunDetail Records
    await prisma.runDetail.deleteMany({
      where: {
        runId: parseInt(runId),
      },
    });

    // then delete the run itself
    await prisma.run.delete({
      where: {
        id: parseInt(runId),
      },
    });

    res.send({ message: "Run deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete run" });
  }
});

export default runsRoutes;
