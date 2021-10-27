
var viewer;

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  }
  const config = {
    disabledExtensions: { diffTool: true },
    extensions: ["LabelsExtension"],
    useADP: false
  };


  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), config)
    viewer.start()
    var documentId = 'urn:' + urn
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure)


  })
}

let hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
    , (m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))
let circle = new THREE.SphereGeometry(0.1, 32, 16)
let mat = new THREE.MeshBasicMaterial({ color: 0xffff00 })
let mesh = new THREE.Mesh(circle, mat)
mesh.position.x = 0
mesh.position.y = 0
mesh.position.z = 2

let mesh2 = new THREE.Mesh(circle, mat)
mesh2.position.x = 0
mesh2.position.y = 2
mesh2.position.z = 1

function onDocumentLoadSuccess(doc) {
  viewer.overlays.addScene('scene')
  viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, e => onLoadFinished());
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
    fetch('/api/forge/oss/ball')
      .then(res => {
        return res.json()
      })
      .then(data => {
        data.map(e => {
          let mesh = new THREE.Mesh(circle, mat)
          mesh.position.x = e.lat
          mesh.position.y = e.lon
          mesh.position.z = e.alt
          viewer.overlays.addMesh(mesh, 'scene')
        })
        return fetch('/api/forge/oss/color')
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        data.forEach(e => {
          let color = hexToRgb(e.color)
          let colorVector = new THREE.Vector4(color[0] / 255, color[1] / 255, color[2] / 255, 1)
          viewer.setThemingColor(e.id, colorVector)
        })
      })
  })
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in)
    })
  })
}

function onLoadFinished() {
  const ext = viewer.getExtension("LabelsExtension");
  // ext.initLabels(labels);
  viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, e => ext.onClickAddLabel(e));
}

