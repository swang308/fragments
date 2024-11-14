// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require('../../response');
const MarkdownIt = require('markdown-it');
const sharp = require('sharp');

module.exports = async (req, res) => {
  const { id, ext } = req.params;
  const md = new MarkdownIt();

  try {
    const fragment = new Fragment(await Fragment.byId(req.user, id));
    const fragData = await fragment.getData();

    // Validate type support
    if (!Fragment.isSupportedType(fragment.type)) {
      return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
    }

    // Map of supported conversions
    const conversions = {
      html: ['text/markdown', 'text/html'],
      txt: ['text/plain', 'text/markdown', 'text/html', 'text/csv', 'application/json'],
      md: ['text/markdown'],
      json: ['application/json', 'text/csv'],
      csv: ['text/csv'],
      image: ['image/'],
    };

    // Conversion handlers
    const convertToHtml = () => {
      const convertedData = md.render(fragData.toString());
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(convertedData);
    };

    const convertToText = () => {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(fragData);
    };

    const convertToImage = async () => {
      try {
        const convertedData = await sharp(Buffer.from(fragData)).toFormat(ext).toBuffer();
        res.setHeader('Content-Type', `image/${ext}`);
        return res.status(200).send(convertedData);
      } catch (error) {
        logger.error({ error }, 'Converting image failed');
        return res.status(415).json(createErrorResponse(415, 'Image conversion failed'));
      }
    };

    // Conversion logic
    if (ext) {
      if (ext === 'html' && conversions.html.includes(fragment.type)) return convertToHtml();
      if (ext === 'txt' && conversions.txt.includes(fragment.type)) return convertToText();
      if (ext === 'md' && conversions.md.includes(fragment.type)) {
        res.setHeader('Content-Type', 'text/markdown');
        return res.status(200).send(fragData);
      }
      if (ext === 'json' && conversions.json.includes(fragment.type)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(fragData);
      }
      if (ext === 'csv' && conversions.csv.includes(fragment.type)) {
        res.setHeader('Content-Type', 'text/csv');
        return res.status(200).send(fragData);
      }
      if (conversions.image.includes(ext) && fragment.type.startsWith('image/')) return convertToImage();

      return res.status(415).json(createErrorResponse(415, `Unsupported conversion: .${ext}`));
    }

    // Default response when no extension is specified
    res.setHeader('Content-Type', fragment.type);
    return res.status(200).send(fragData);

  } catch (err) {
    logger.error({ err }, 'Failed to get fragment metadata');
    return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
