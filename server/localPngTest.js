import { renderPostPng } from './canvasRenderer.js';

try {
  const buf = renderPostPng('se-tax-trap-153');
  console.log('Success! PNG Buffer Bytes:', buf.length);
} catch (err) {
  console.error('Local PNG Render Error:', err);
}
