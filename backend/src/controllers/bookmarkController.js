import Bookmark from '../models/Bookmark.js';

export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('question')
      .sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const { questionId, note } = req.body;

    const existing = await Bookmark.findOne({ user: req.user._id, question: questionId });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({ bookmarked: false, questionId });
    }

    const created = await Bookmark.create({
      user: req.user._id,
      question: questionId,
      note: note || '',
    });

    const populated = await Bookmark.findById(created._id).populate('question');
    res.status(201).json({ bookmarked: true, bookmark: populated });
  } catch (error) {
    next(error);
  }
};
