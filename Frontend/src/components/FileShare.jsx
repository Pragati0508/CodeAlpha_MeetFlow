import { useState } from "react";

function FileShare() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile) return;

    setFiles((prev) => [
      ...prev,
      uploadedFile,
    ]);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">
          📁 File Sharing
        </h2>
      </div>

      <div className="bg-slate-700 p-6 rounded-xl border border-slate-600">

        <label className="cursor-pointer inline-block bg-violet-600 hover:bg-violet-700 px-5 py-3 rounded-lg font-semibold transition">
          Upload File
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <div className="mt-6">
          {files.length === 0 ? (
            <div className="bg-slate-800 p-4 rounded-lg text-slate-400">
              No files shared yet
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-slate-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      📄 {file.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  <span className="bg-green-600 px-3 py-1 rounded-lg text-sm">
                    Uploaded
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default FileShare;