import { type LineToken } from './chords';

function getTagName(tag: string) {
  if (/verse/i.test(tag)) {
    return 'tag-verse';
  }

  if (/chorus/i.test(tag)) {
    return 'tag-chorus';
  }

  if (/intro/i.test(tag)) {
    return 'tag-intro';
  }

  if (/bridge/i.test(tag)) {
    return 'tag-bridge';
  }

  if (/outro/i.test(tag)) {
    return 'tag-outro';
  }

  return 'tag-verse';
}

export type TokenTag =
  | 'tag-verse'
  | 'tag-chorus'
  | 'tag-intro'
  | 'tag-bridge'
  | 'tag-outro';

export type TaggedLineToken = LineToken & {
  tag: TokenTag;
};

function attachTags(lines: LineToken[]): TaggedLineToken[] {
  let currentTag = 'tag-verse';

  return lines.map((item) => {
    if (item.type === 'tagLine') {
      currentTag = getTagName(item.value);
    }
    return { tag: currentTag, ...item } as TaggedLineToken;
  });
}

function markSectionEnd(lines: TaggedLineToken[]) {
  return lines.map((line, index) => {
    const nextLine = lines[index + 1];

    return {
      ...line,
      sectionEnd: nextLine === undefined || nextLine?.type === 'tagLine',
    };
  });
}

function dropRedundantEmptyLinesData(lines: LineToken[]) {
  const set = new Set(['emptyLine', 'tagLine']);

  return lines.filter((item, index, array) => {
    if (item.type === 'emptyLine') {
      const nextItem = array[index + 1];      
      // Drop if it is next to another emptyLine
      return !set.has(nextItem?.type || '');
    }

    // Keep all other items
    return true;
  });
}

export function tagLines(lines: LineToken[]): LineToken[] {
  return markSectionEnd(attachTags(dropRedundantEmptyLinesData(lines)));
}
