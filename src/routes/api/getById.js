const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require('../../response');
const MarkdownIt = require('markdown-it');
const sharp = require('sharp');

module.exports = async (req, res) => {
  const { id, ext } = req.params;
  const md = MarkdownIt();

  try {
    const fragment = await Fragment.byId(req.user, id);

    if (!fragment) {
      logger.warn(`Fragment with ID ${id} not found.`);
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    if (!Fragment.isSupportedType(fragment.type)) {
      logger.warn(`Unsupported fragment type: ${fragment.type}`);
      return res.status(415).json(createErrorResponse(415, 'Unsupported fragment type'));
    }

    const fragData = await fragment.getData();

    // Determine response based on requested extension
    switch (ext) {
      case 'html':
        if (['text/markdown', 'text/html'].includes(fragment.type)) {
          const convertedData = md.render(fragData.toString());
          res.setHeader('Content-Type', 'text/html');
          return res.status(200).send(convertedData);
        }
        break;

      case 'txt':
        if (['text/plain', 'text/markdown', 'text/html', 'text/csv', 'application/json'].includes(fragment.type)) {
          res.setHeader('Content-Type', 'text/plain');
          return res.status(200).send(fragData);
        }
        break;

      case 'md':
        if (fragment.type === 'text/markdown') {
          res.setHeader('Content-Type', 'text/markdown');
          return res.status(200).send(fragData);
        }
        break;

      case 'json':
        if (['application/json', 'text/csv'].includes(fragment.type)) {
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).send(fragData);
        }
        break;

      case 'csv':
        if (fragment.type === 'text/csv') {
          res.setHeader('Content-Type', 'text/csv');
          return res.status(200).send(fragData);
        }
        break;

      case 'png':
      case 'jpg':
      case 'webp':
      case 'gif':
      case 'avif':
        if (fragment.type.startsWith('image/')) {
          try {
            const convertedData = await sharp(Buffer.from(fragData)).toFormat(ext).toBuffer();
            res.setHeader('Content-Type', `image/${ext}`);
            return res.status(200).send(convertedData);
          } catch (error) {
            logger.error({ error }, `Error converting image to ${ext}`);
            return res.status(415).json(createErrorResponse(415, `Error converting image to ${ext}`));
          }
        }
        break;

      default:
        if (!ext) {
          res.setHeader('Content-Type', fragment.type);
          return res.status(200).send(fragData);
        }
        break;
    }

    logger.warn(`Unsupported conversion for extension: ${ext}`);
    res.status(415).json(createErrorResponse(415, 'Unsupported conversion type'));
  } catch (err) {
    logger.error({ err }, `Error fetching fragment with ID ${id}`);
    res.status(500).json(createErrorResponse(500, 'Unable to retrieve the fragment'));
  }
};
