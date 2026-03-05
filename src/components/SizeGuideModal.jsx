import { X } from 'lucide-react';
import React from 'react';

function SizeGuideModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay open" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>
                    <X size={24} />
                </button>
                <h2>SIZE GUIDE</h2>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Size</th>
                                <th>Chest (in)</th>
                                <th>Length (in)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>S</td><td>20"</td><td>27"</td></tr>
                            <tr><td>M</td><td>22"</td><td>28"</td></tr>
                            <tr><td>L</td><td>24"</td><td>29"</td></tr>
                            <tr><td>XL</td><td>26"</td><td>30"</td></tr>
                            <tr><td>XXL</td><td>28"</td><td>31"</td></tr>
                        </tbody>
                    </table>
                </div>
                <p className="size-note">Measurements are flat across. For oversized look, size up.</p>
            </div>
        </div>
    );
}

export default SizeGuideModal;
