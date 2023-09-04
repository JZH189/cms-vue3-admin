/**
 * 扁平数据转tree
 * @param data 
 * @param parentId 
 * @returns 
 */
export default function listToTree(data: any[], parentId: number = 0): any[] {
    const tree: any = [];
    data.forEach(node => {
      if (node.parentId === parentId) {
        const children = listToTree(data, node.id);
        if (children.length) {
            node.children = children;
        }
        tree.push(node);
      }
    });

    return tree;
}