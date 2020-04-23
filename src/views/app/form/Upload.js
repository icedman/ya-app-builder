import React from 'react';
import UploadField from 'components/UploadField/UploadField';
import FileList from 'components/UploadField/FileList';

const StatefulUpload = (props) => {
  let fs = props.context;
  let files = fs.getState(props.model) || [];
  return (
    <div>
      <UploadField basepath={props.basepath} {...fs.model(props.model)} />
      <FileList {...fs.model(props.model)} context={fs} />
    </div>
  );
};

export default StatefulUpload;
