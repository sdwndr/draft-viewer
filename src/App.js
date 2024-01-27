import './App.css';
import { useState, useMemo } from 'react';

function App() {
  const [file, setFile] = useState();
  const [fileContents, setFileContents] = useState()

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const viewDraft = () => {
    const textType = /text.*/;
    if (!file.type.match(textType) || !file) {
      alert('Draftmancer Text File Please')
      return
    }


    const reader = new FileReader()
    reader.onload = async (e) => { 
      setFileContents(reader.result)
    };

    reader.readAsText(file)
  }


  const parsedFileContents = useMemo(() => {
    if (!file || !fileContents) {
      return
    }

    const result = fileContents?.split('\n\n')
    const drafters = result.shift().split('\n').slice(3)

    const packs = result.filter((item) => item.startsWith('Pack') )
    const pack1 = packs.splice(0, 14)
    const pack2 = packs.splice(0, 14)
    const pack3 = packs

    const draftersWithOrder = (direction) => {
      if (direction === 'left') {

      }
      
      return <div className="font-bold flex">
        {drafters.map((drafter, i) => {
        let drafterCopy = drafter
        
        if (i !== drafters.length - 1) {
          drafterCopy += '  -->'
        }

        if (drafter.startsWith('-->')) {
          return <div className="text-green-500 pr-1">{drafterCopy.slice(4)}</div>
        }
        
        return <div className="pr-1">{drafterCopy}</div>
      })}
      </div>
    }

    const showPacks = (pack) => {
      
      return <>
        {pack.map((singlePack, i) => {
            const cardList = singlePack.split('\n')
            return cardList.map((line, i) => {  
              if (i === 0) {
                return <div className="mt-4">{line}</div>
              }
              
              if (line.startsWith('-->')) {
                return <div className="text-green-500">{line}</div>
              }

              return <div>{line}</div>
          })
        })}
      </>
    }

    return <>
      {draftersWithOrder('right')}
      {showPacks(pack1)}
      {showPacks(pack2)}
      {showPacks(pack3)}
    </>
  }, [file, fileContents])

  return (
    <div className="p-4 text-center text-gray-200 bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-fit p-4 flex flex-col items-center">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
        <input onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />

        <button className="m-2 mt-4 p-2 max-w-40 bg-slate-600" onClick={viewDraft}>View Draft</button>
      </div>

      {fileContents ? parsedFileContents : ''}
    </div>
  );
}

export default App;
