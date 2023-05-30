const { ethers } = require('ethers');
const { KNOWLEDGE_BLOCKS } = require('./constants');

exports.registerPrice = ethers.utils.parseEther('0.05').toString();
exports.registerClassFee = ethers.utils.parseEther('0.5').toString();

exports.teacherInfoURLs = Array(10)
  .fill(' ')
  .map((_, idx) => `http://teacher-info.com/${idx + 1}`);

exports.studentInfoURLs = Array(10)
  .fill('')
  .map((_, idx) => `http://student-info.com/${idx + 1}`);

exports.courseInfoURIs = Array(10)
  .fill('')
  .map((_, idx) => `http://courscoursee-info.com/${idx + 1}`);

exports.classRegistrationInfoURLs = Array(10)
  .fill('')
  .map((_, idx) => `http://class-registration-info.com/${idx + 1}`);

exports.courses = [
  {
    prevCourseId: 0,
    knowledgeBlockId: KNOWLEDGE_BLOCKS.GENERAL.id,
    credits: 4,
    uri: this.courseInfoURIs[0],
  },
  {
    prevCourseId: 0,
    knowledgeBlockId: KNOWLEDGE_BLOCKS.GENERAL.id,
    credits: 4,
    uri: this.courseInfoURIs[1],
  },
];
