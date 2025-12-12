import CustomerFeedbackModel from '../../models/customer/CustomerFeedbackModel.js';

// GET REQUEST
export const getAllFeedbacks = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; 
    const feedbacks = await CustomerFeedbackModel.getAll(startDate, endDate);
    res.json(feedbacks); 

  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
};

export const createFeedback = async (req, res) => {

    try {
        const createdFeedback = await CustomerFeedbackModel.create(req.body);
        res.status(201).json({ success: true, message: "Submitted", feedback: createdFeedback });
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({ success: false, error: "Failed to submit" });
    }
};