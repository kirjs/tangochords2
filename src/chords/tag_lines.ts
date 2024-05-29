
function getTagName(tag: string){
    if(/verse/i.test(tag)){
        return 'tag-verse';
    }

    if(/chorus/i.test(tag)){
        return 'tag-chorus';
    }

    return 'tag-verse';
}


function attachTags(lines: LineItem[]): LineItem[] {
    let currentTag = 'tag-verse';


    return lines.map(item => {
        if (item.type === 'tagLine') {
            currentTag = getTagName(item.value);
        } 
        return {tag: currentTag, ...item};
    });
}

function markSectionEnd(lines){
    return lines.map((line, index) => {
        const nextTag = lines[index + 1]?.tag
        console.log(nextTag, line.tag, nextTag !== line.tag)
        return {
            ...line,
            sectionEnd: nextTag !== line.tag,
        }
    })
}


export function tagLines(lines: LineItem[]): LineItem[] {
   return markSectionEnd(attachTags(lines));
}
