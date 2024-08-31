export const replaceEmailBody = (action: any, metadata: any) => {
  //first i need to map thorugh actions. For each action search through the action.metadata and find the string starting and ending with {} braces. then replace that part with the corresponsing value in from metadata. We acn use a map to make this work.

  const replacePlaceholder = (text: string) => {
    return text.replace(/{(.*?)}/g, (match, key) => {
      return metadata[key] || match;
    });
  };
  const updatedMetadata = {
    ...action.metadata,
    to: replacePlaceholder(action.metadata.to),
    body: replacePlaceholder(action.metadata.body),
    subject: replacePlaceholder(action.metadata.subject),
  };
  return updatedMetadata;
};

export const replaceSolanaBody = (action: any, metadata: any) => {
  const replacePlaceholder = (text: string) => {
    return text.replace(/{(.*?)}/g, (match, key) => {
      return metadata[key] || match;
    });
  };
  const updatedMetadata = {
    ...action.metadata,
    to: replacePlaceholder(action.metadata.to),
    amount: replacePlaceholder(action.metadata.amount),
  };
  return updatedMetadata;
};
