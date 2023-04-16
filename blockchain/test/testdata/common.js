const { ethers } = require('ethers');

exports.registerPrice = ethers.utils.parseEther('0.05').toString();

exports.teacherInfoURLs = Array(10)
  .fill(' ')
  .map((_, idx) => `http://teacher-info.com/${idx + 1}`);
