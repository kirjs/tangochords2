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

function attachTags(lines: LineItem[]): LineItem[] {
  let currentTag = 'tag-verse';

  return lines.map((item) => {
    if (item.type === 'tagLine') {
      currentTag = getTagName(item.value);
    }
    return { tag: currentTag, ...item };
  });
}

function markSectionEnd(lines) {
  return lines.map((line, index) => {
    const nextLine = lines[index + 1];

    return {
      ...line,
      sectionEnd: nextLine === undefined || nextLine?.type === 'tagLine',
    };
  });
}

function dropRedundantEmptyLinesData(lines: LineItem[]) {
  return lines.filter((item, index, array) => {
    if (item.type === 'emptyLine') {
      const nextItem = array[index + 1];
      const set = new Set(['emptyLine', 'tagLine']);
      // Drop if it is next to another emptyLine
      return !set.has(nextItem?.type);
    }

    // Keep all other items
    return true;
  });
}

export function tagLines(lines: LineItem[]): LineItem[] {
  console.log(markSectionEnd(attachTags(lines)));
  return markSectionEnd(attachTags(dropRedundantEmptyLinesData(lines)));
}
