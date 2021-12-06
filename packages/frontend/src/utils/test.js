const textOnGif = require('text-on-gif');

export const getGif = async blob => {
  var gifBuffer = await textOnGif({
    file_path: URL.createObjectURL(blob), //path to local file or url
    textMessage: 'custom message',
    font_path: null,
  });
  return gifBuffer;
};
