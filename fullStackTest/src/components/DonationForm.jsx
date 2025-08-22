import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Input from "./controls/Input";
import Checkbox from "./controls/Checkbox";
import Button from "./controls/Button";

class DonationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        organizationName: "",
        contactEmail: "",
        contactNumber: "",
        donationType: "",
        quantity: "",
        description: "",
        isPerishable: false,
        requiresFridge: false,
        requiresFreezer: false,
      },
      errors: {},
      isSubmitted: false,
      isSubmitting: false,
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSelectChange = this._handleSelectChange.bind(this);
    this._handleCheckboxChange = this._handleCheckboxChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._resetForm = this._resetForm.bind(this);
  }

  _handleInputChange(e) {
    const { name, value } = e.target;
    const { formData, errors } = this.state;

    const nextFormData = {
      ...formData,
      [name]: value,
    };

    // Clear error for this field when user starts typing
    const nextErrors = { ...errors };
    if (nextErrors[name]) {
      delete nextErrors[name];
    }

    this.setState({
      formData: nextFormData,
      errors: nextErrors,
    });
  }

  _handleSelectChange(e) {
    this._handleInputChange(e);
  }

  _handleCheckboxChange(e) {
    const { name, checked } = e.target;
    const { formData } = this.state;

    this.setState({
      formData: {
        ...formData,
        [name]: checked,
      },
    });
  }

  // Field-specific validation methods
  _validateOrganizationName(value) {
    if (!value || value.trim().length < 2) {
      return "Organization name is required (min 2 characters).";
    }
    return null;
  }

  _validateContactEmail(value) {
    if (!value) return "Contact email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address.";
    }
    return null;
  }

  _validateContactNumber(value) {
    if (!value) return "Contact number is required.";
    const digits = (value.match(/\d/g) || []).length;
    const allowed = /^[0-9+()\-\s]*$/;
    if (!allowed.test(value) || digits < 10 || digits > 11) {
      return "Please enter a valid contact number (10-11 digits).";
    }
    return null;
  }

  _validateDonationType(value) {
    if (!value) return "Donation type is required.";
    return null;
  }

  _validateQuantity(value) {
    if (!value || value.toString().trim() === "") {
      return "Estimated quantity is required.";
    }
    return null;
  }

  _validateForm() {
    const { formData } = this.state;
    const errors = {};

    const orgErr = this._validateOrganizationName(formData.organizationName);
    if (orgErr) errors.organizationName = orgErr;

    const emailErr = this._validateContactEmail(formData.contactEmail);
    if (emailErr) errors.contactEmail = emailErr;

    const phoneErr = this._validateContactNumber(formData.contactNumber);
    if (phoneErr) errors.contactNumber = phoneErr;

    const typeErr = this._validateDonationType(formData.donationType);
    if (typeErr) errors.donationType = typeErr;

    const qtyErr = this._validateQuantity(formData.quantity);
    if (qtyErr) errors.quantity = qtyErr;

    return errors;
  }

  _handleSubmit(e) {
    e.preventDefault();

    const errors = this._validateForm();

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({ isSubmitting: true });

    // Simulate API call
    setTimeout(() => {
      console.log("Donation submitted:", this.state.formData);
      this.setState({
        isSubmitted: true,
        isSubmitting: false,
      });
    }, 1500);
  }

  _resetForm() {
    this.setState({
      formData: {
        organizationName: "",
        contactEmail: "",
        contactNumber: "",
        donationType: "",
        quantity: "",
        description: "",
        isPerishable: false,
        requiresFridge: false,
        requiresFreezer: false,
      },
      errors: {},
      isSubmitted: false,
      isSubmitting: false,
    });
  }

  _renderSuccessMessage() {
    const { formData } = this.state;
    return (
      <div className="success-message">
        <h3>Thank you for your donation!</h3>
        <p>
          Your food donation from <strong>{formData.organizationName}</strong>{" "}
          has been successfully submitted. We will contact you at{" "}
          <strong>{formData.contactEmail}</strong> with pickup details.
        </p>
        <Button type="secondary" onClick={this._resetForm}>
          Submit Another Donation
        </Button>
      </div>
    );
  }

  _renderDonationTypeSelect() {
    const { formData, errors } = this.state;
    return (
      <div className="input-container">
        <label htmlFor="donationType">Donation Type</label>
        <div className="input-accessory-container">
          <select
            id="donationType"
            name="donationType"
            value={formData.donationType}
            onChange={this._handleSelectChange}
            className={errors.donationType ? "error" : ""}
          >
            <option value="">Select donation type</option>
            <option value="prepared-food">Prepared Food</option>
            <option value="packaged-goods">Packaged Goods</option>
            <option value="produce">Fresh Produce</option>
            <option value="dairy">Dairy Products</option>
            <option value="other">Other</option>
          </select>
        </div>
        {errors.donationType && (
          <span className="error-message">{errors.donationType}</span>
        )}
      </div>
    );
  }

  render() {
    const { formData, errors, isSubmitted, isSubmitting } = this.state;

    if (isSubmitted) {
      return this._renderSuccessMessage();
    }

    return (
      <form className="donation-form" onSubmit={this._handleSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">Organization Information</h3>
          <div className="form-grid">
            <Input
              labelText="Organization Name"
              inputProps={{
                id: "organizationName",
                name: "organizationName",
                type: "text",
                value: formData.organizationName,
                placeholder: "Enter organization name",
                onChange: this._handleInputChange,
              }}
              isValid={!errors.organizationName}
              error={errors.organizationName}
            />

            <Input
              labelText="Contact Email"
              inputProps={{
                id: "contactEmail",
                name: "contactEmail",
                type: "email",
                value: formData.contactEmail,
                placeholder: "Enter contact email address",
                onChange: this._handleInputChange,
              }}
              isValid={!errors.contactEmail}
              error={errors.contactEmail}
            />

            <Input
              labelText="Contact Number"
              inputProps={{
                id: "contactNumber",
                name: "contactNumber",
                type: "text",
                value: formData.contactNumber,
                placeholder: "Enter contact phone number",
                onChange: this._handleInputChange,
              }}
              isValid={!errors.contactNumber}
              error={errors.contactNumber}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Donation Details</h3>
          <div className="form-grid">
            {this._renderDonationTypeSelect()}

            <Input
              labelText="Estimated Quantity"
              inputProps={{
                id: "quantity",
                name: "quantity",
                type: "text",
                value: formData.quantity,
                placeholder: "e.g., 50 lbs, 20 servings, 10 cases",
                onChange: this._handleInputChange,
              }}
              isValid={!errors.quantity}
              error={errors.quantity}
            />

            <div className="full-width">
              <Input
                labelText="Description"
                inputTag="textarea"
                inputProps={{
                  id: "description",
                  name: "description",
                  value: formData.description,
                  placeholder: "Additional details about the donation...",
                  onChange: this._handleInputChange,
                }}
                isValid={!errors.description}
                error={errors.description}
              />
            </div>
          </div>

          <Checkbox
            name="requiresFridge"
            label="This donation requires a fridge"
            checked={formData.requiresFridge}
            onChange={this._handleCheckboxChange}
          />

          <Checkbox
            name="requiresFreezer"
            label="This donation requires a freezer"
            checked={formData.requiresFreezer}
            onChange={this._handleCheckboxChange}
          />
        </div>

        <div className="form-actions">
          <Button
            type="secondary"
            onClick={this._resetForm}
            disabled={isSubmitting}
          >
            Reset Form
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            Submit Donation
          </Button>
        </div>
      </form>
    );
  }
}

/**
 * DonationForm component prop-types.
 * @memberof module:components/DonationForm
 */
DonationForm.propTypes = {
  onSubmit: PropTypes.func,
};

DonationForm.defaultProps = {
  onSubmit: () => {},
};

export default DonationForm;
