import { defineEventHandler, setResponseHeader, send } from 'h3';
import { fetchInitial } from '@/utils/fetchInitial';

export default defineEventHandler(async (event) => {
  if (event.node.req.url !== '/robots.txt') return;
  setResponseHeader(event, 'Content-Type', 'text/plain');
  const global = await fetchInitial();
  const robotsText = global?.robots || 'User-agent: *\nDisallow:';

  return send(event, robotsText);
});
