const { ethers } = require('ethers');

exports.registerPrice = ethers.utils.parseEther('0.05').toString();
exports.registerClassFee = ethers.utils.parseEther('0.5').toString();

exports.teacherInfoURLs = Array(10)
  .fill(' ')
  .map((_, idx) => `http://teacher-info.com/${idx + 1}`);

exports.studentInfoURLs = Array(10)
  .fill('')
  .map((_, idx) => `http://student-info.com/${idx + 1}`);

exports.classRegistrationInfoURLs = Array(10)
  .fill('')
  .map((_, idx) => `http://class-registration-info.com/${idx + 1}`);
  