import Input from '../ui/Input'
import Card from '../ui/Card'
import Button from '../ui/Button'

function CertificationsForm({ certifications, onAdd, onUpdate, onRemove }) {
  const handleAdd = () => {
    onAdd()
  }

  const handleUpdate = (id, field, value) => {
    onUpdate(id, { [field]: value })
  }

  const handleRemove = (id) => {
    onRemove(id)
  }

  return (
    <Card title="Certifications">
      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div
            key={cert.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">
                Certification #{index + 1}
              </h4>
              {certifications.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => handleRemove(cert.id)}
                  type="button"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Certification Name *"
                value={cert.name}
                onChange={(e) => handleUpdate(cert.id, 'name', e.target.value)}
                placeholder="AWS Certified Solutions Architect"
              />
              <Input
                label="Issuing Organization"
                value={cert.issuer}
                onChange={(e) => handleUpdate(cert.id, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="month"
                value={cert.date}
                onChange={(e) => handleUpdate(cert.id, 'date', e.target.value)}
              />
              <Input
                label="Credential URL"
                type="url"
                value={cert.url}
                onChange={(e) => handleUpdate(cert.id, 'url', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={handleAdd}
          type="button"
          className="w-full"
        >
          + Add Certification
        </Button>
      </div>
    </Card>
  )
}

export default CertificationsForm

